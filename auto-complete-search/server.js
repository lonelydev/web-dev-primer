function getRandomString({length}){
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

function getRandomInteger({
    min,
    max
  }){
      return parseInt(Math.random()*(max-min)+min);
  }

function generateSuggestion(prefix){
    const RATIO_EXACT_MATCH = 0.3;
    const RATIO_AUTOCORRECT = 0.1;

    if (Math.random < RATIO_AUTOCORRECT) {
        return getRandomString({
            length: getRandomInteger({
                min: 1, 
                max: prefix.length
            })
        });
    }

    if (Math.random() < RATIO_EXACT_MATCH) {
        return prefix;
    }
    return prefix + getRandomString({
        length: getRandomInteger({
            min: 1,
            max: 10
        })
    });
}

/*
    return a list of strings
    return varied results to test the bolding of individual letters 
    different search results return different results

    multiple results that share the same string prefix, include additional information
    followed by a hyphen.

 */
function getAutocompleteHandler(data){
    const MAX_CHARS = 10;
    const NUM_AUTOCOMPLETE_RESULTS = 10;
    const RATIO_AUXILIARY_DATA = 0.1;

    if (data.length > MAX_CHARS){
        return [];
    }

    const results = [];
    while (results.length < NUM_AUTOCOMPLETE_RESULTS){
        const suggestion = generateSuggestion(data);
        
        /** check if there's a result with the same suggestion 
         * as the one generated */
        if (results.find(
            result => result.suggestion === suggestion
            )) {
            continue;
            }

        if (Math.random() < RATIO_AUXILIARY_DATA){
            results.push({
                suggestion,
                auxiliary: getRandomString({
                    length: getRandomInteger({
                        min: 5, 
                        max: 15
                    })
                })
            });
        } else {
            results.push({
                suggestion, 
                auxiliary: ""
            });
        }
    }
    return results;
}

const endpoints = {
    "/": {
      "get": () => "hello world"
    },
    "/autocomplete": {
      "get": getAutocompleteHandler
    }
  }

const HOST = "server.com/";

const searchInput = document.getElementsByClassName("search__bar__input")[0];

function createSuggestionElement({suggestion, auxiliaryData}){
    const auxiliaryString = auxiliaryData ? ` - ${auxiliaryData}` : "";
    return `<li class="search__suggestions__list__result">${suggestion}${auxiliaryString}</li>`;
}

function onSuggestionsResponse(data){
    const suggestionsElement = document.getElementsByClassName("search__suggestions__list")[0];
    let suggestionsHTML = "";
    for (const suggestion of data){
        suggestionsHTML += createSuggestionElement({
            suggestion: suggestion.suggestion, 
            auxiliaryData: suggestion.auxiliary
        });
    }
    suggestionsElement.innerHTML = suggestionsHTML;
}

function onNewInput(event) {
    api.get(HOST + 'autocomplete', searchInput.value, onSuggestionsResponse);
}

searchInput.oninput = onNewInput;

// API library
function getFunction(url, data, callback) {
    const domain = url.substring(0, url.indexOf("/"));
    const endpoint = url.substring(url.indexOf("/"), url.length);

    callback(endpoints[endpoint]["get"](data));
}

const api = {
    get: getFunction
};


