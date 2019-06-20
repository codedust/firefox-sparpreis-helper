/*jshint esversion: 6 */

// select the 'Sparpreis-Finder' tab per default on bahn.de
let sparpreisButton = document.querySelector('li[data-content="sparpreis"]');
if (sparpreisButton != null) {
  sparpreisButton.click();
}

// TODO: select a Bahncard as default selection

function priceToFloat(value) {
  return parseFloat(value.replace(' €', '').replace(',','.').replace(/F |S+ |S /gi, ''));
}

// inject CSS code for result site
if(document.querySelector('#verbindungen-box') != null) {
  // include CSS file
  var cssURL = browser.runtime.getURL("ps.bahn.de.css");
  var link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("type", "text/css");
  link.setAttribute("href", cssURL);
  document.getElementsByTagName("head")[0].appendChild(link);
}

// convert decimal values to rgb hex color toRGBstring(255, 0, 0) => '#ff0000')
function toRGBstring(r, g, b) {
  return '#' + (r<16?'0':'') + r.toString(16) + (g<16?'0':'') + g.toString(16) + (b<16?'0':'') + b.toString(16);
}

// convert rgb hex color to decimal values (e.g. parseRBGstring('#ff0000') => [255, 0, 0])
function parseRBGstring(color) {
  return [parseInt(color.substr(1,2), 16), parseInt(color.substr(3,2), 16), parseInt(color.substr(5,2), 16)];
}

// create a color gradient between color1 and color2
// usage: createColorGradient('#ff0000', '#00ff00', 7)
function createColorGradient(color1, color2, steps) {
  color1 = parseRBGstring(color1);
  color2 = parseRBGstring(color2);
  var colors = [];
  for (var i = 0; i < steps; i++) {
    var clampedR = Math.round(color1[0] + (color2[0] - color1[0]) * i / (steps - 1));
    var clampedG = Math.round(color1[1] + (color2[1] - color1[1]) * i / (steps - 1));
    var clampedB = Math.round(color1[2] + (color2[2] - color1[2]) * i / (steps - 1));
    colors.push(toRGBstring(clampedR, clampedG, clampedB));
  }
  return colors;
}

// js styling when .fahrdata is modified (e.g. after an xhr)
document.querySelectorAll('.fahrtdata').forEach(function(targetNode){
  var observer = new MutationObserver(function(mutationsList, observer) {
    for(var mutation of mutationsList) {
      if (mutation.type == 'childList') {
        let costs = document.querySelectorAll('tbody.fahrtdata td.colpreis');
        let costsFloat = Array.from(costs).map(el => priceToFloat(el.innerText));
        let costsFloatSorted = Array.from(new Set(costsFloat)).sort();
        let colorGradient = createColorGradient('#BEF954', '#FF5553', costsFloatSorted.length);
        let costColorsMap = new Map(costsFloatSorted.map(value => [value, colorGradient[costsFloatSorted.indexOf(value)]]));
        costs.forEach(el => el.style.backgroundColor = costColorsMap.get(priceToFloat(el.innerText)));
      }
    }
  });

  observer.observe(targetNode, { childList: true });
});
