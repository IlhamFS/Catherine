'use strict'

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const tg = new Telegram.Telegram('249713301:AAG2bEdJuG9PCd1WZYYypcVTLiDoga7ppLQ')
const BaseScopeExtension = Telegram.BaseScopeExtension
var theaters = require('./scraping_theaters.js')
var movies = require('./scraping_movies.js')
var scheduling_time = false;
class TheatersController extends TelegramBaseController {
    /**
     * @param {Scope} $
     */
    theaterHandler($) {

    theaters(function(err, result){
      $.sendMessage(result);
    });
    }

    get routes() {
        return {
            '/showtheaters': 'theaterHandler'
        }
    }
}
class SumScopeExtension extends BaseScopeExtension {
    process(num1, num2, num3, num4) {
        return num1 + " " + num2 + " " + num3 + " " + num4;
    }

    get name() {
        return 'sum';
    }
}

class ScheduleController extends TelegramBaseController {
    /**
     * @param {Scope} $
     */
    scheduleHandler($) {
      const form = {
        movie: {
            q: 'Tell me your theater',
            error: 'sorry, wrong input',
            validator: (message, callback) => {
                if(message.text) {
                    callback(true, message.text) //you must pass the result also
                    return
                }

                callback(false)
            }
        }
    }

    $.runForm(form, (theater) => {
        movies(theater.movie.toUpperCase(), function(err, result){
          $.sendMessage(result);
        });
    })

    }

    get routes() {
        return {
            '/schedule': 'scheduleHandler'
        }
    }
}

tg.router
    .when(['/showtheaters'], new TheatersController())
    .when('/schedule', new ScheduleController())
tg.addScopeExtension(SumScopeExtension);
