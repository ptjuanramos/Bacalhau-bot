// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {
    TurnContext,
    MessageFactory,
    TeamsActivityHandler,
    CardFactory,
    ActionTypes
} = require('botbuilder');

const fs = require('fs');

class BotActivityHandler extends TeamsActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context, next) => {
            TurnContext.removeRecipientMention(context.activity);

            await context.sendActivity({ attachments: [this.getBacalhauCard()] });                
            await next();
        });
    }

    getNonBacalhauCard() {
        return CardFactory.heroCard(
            'No Bacalhau for you!',
            ['https://terradobacalhau.com/wp/wp-content/uploads/2020/09/JCL_6983-scaled.jpg'],
            [{
                type: ActionTypes.ShowImage,
                title: recipe.title,
                value: recipe.url
            }]
        );
    }

    getBacalhauCard() {
        let recipe = this.getRandomRecipe();

        if(!recipe || recipe == null) {
            return this.getNonBacalhauCard();
        }

        console.log(recipe.url);

        return CardFactory.heroCard(
            'Here is your bacalhau',
            CardFactory.images(['http://4.bp.blogspot.com/-_3aZmINTNaU/UVHDFu3S5mI/AAAAAAAAG5U/kAySWqxDKzA/s1600/bacalhau.jpg']),
            [{
                type: ActionTypes.OpenUrl,
                title: recipe.title,
                value: recipe.url
            }]
        );
    }

    getRandomRecipe() {
        let recipes = JSON.parse(fs.readFileSync('./bacalhaus.json', (e, _) => {
            if(e) {
                console.log(e);
            }
        }));

        if(recipes && recipes.length > 0) {
            var item = recipes[Math.floor(Math.random() * recipes.length)];
            return item;
        }

        return null;
    }

}

module.exports.BotActivityHandler = BotActivityHandler;

