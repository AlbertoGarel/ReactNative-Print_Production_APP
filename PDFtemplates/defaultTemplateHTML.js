const htmlDefaultTemplate = (dataProduction, dataUserAndEnterprise, prodResult, cardsData, numAutopastersLine, contentTextArea) => {
    const {name, enterprise} = dataUserAndEnterprise;
    const dataTextArea = contentTextArea;
    const {date, prodLine, pagination, product, editions} = dataProduction;
    const {kilosConsumidos, kilosTirada, tiradaBruta} = prodResult;
    cardsData.sort((a, b) => a.autopaster - b.autopaster);
    const repeatNum = cardsData.reduce((acc, item) => {
        acc[item.autopaster] = (acc[item.autopaster] || 0) + 1;
        return acc;
    }, {});
    let maxRepeat = Object.values(repeatNum).sort((a, b) => b - a)[0];
    let autopasters = numAutopastersLine;

    //falta: trabajador, empresa
    const restos = (data, autopasters, secondInd, firstInd) => {
        const d = data.filter(item => item.autopaster_fk == autopasters[secondInd])[firstInd];
        if (!d) {
            return ''
        } else if (d.peso_ini === d.peso_actual) {
            return 'X'
        } else {
            return 'R'
        }

    };
    //CREATE AND FILL TABLE
    const createTable = () => {
        let tabla = "<table border='0'>";
        tabla += "</tr>";
        for (let j = 0; j < autopasters.length; j++) {
            tabla += "<td>" + (autopasters[j]) + "</td>";
        }
        tabla += "</tr>";

        for (let i = 0; i < maxRepeat; i++) {
            tabla += "<tr>";
            for (let j = 0; j < autopasters.length; j++) {
                tabla += "<td>" + restos(cardsData, autopasters, j, i) + "</td>";
            }
            tabla += "</tr>";
        }
        tabla += "</table>";
        return tabla;
    };
    // FILL DATA CARDS
    const createCards = () => {
        let cardsToString = ``
        cardsData.forEach(e => {
            // let comsumption = e.weightIni - e.weightEnd;
            cardsToString += `<article  class="border">
        <div class="twoRowBetween">
          <div id="cardLeftRow" class="twoRowBetween" style=" align-self: stretch">
            <div class="startColumn" style="height:100%">
              <p style="text-align: center; margin: 1mm;">cuerpo</p>
              <div id="numauto" class="border height20 width20 centerCenter margin2all">
                <p>${e.autopaster_fk}</p>
              </div>
            </div>
            <div class="centerColumn" style="padding: 3mm">
              <div class="centerRight">
                <p>resto inicio</p>
                <div class="border marginL width20 height9 centerCenter">
                  <p>${e.peso_actual}</p>
                </div>
              </div>
              <div class="centerRight">
                <p>resto final</p>
                <div class="border marginL width20 height9 centerCenter">
                  ${e.weightEnd}
                </div>
              </div>
            </div>
          </div>
          <div id="cardRightRow" class="column">
            <div id="cardCode" class="centerCenter border pad3">`

            e.codepathSVG.length > 0 ?
                cardsToString += `<div class="centerColumn" style="overflow: hidden"><svg style="width: 100%; height: 40px" viewBox="0 0 200 20" fill="#000000">
                    <path d="${e.codepathSVG}" />
                </svg>
                <p style="text-align: center; font-size: 20px">${e.codigo_bobina}</p></div>`
                :
                cardsToString += `<p style="font-size: 20px">${e.codigo_bobina}</p>`

            cardsToString += `</div>
            <div id="cardFinally" class="centerRight pad3">
              <p>consumido</p>
              <div class="marginL border height9 width30 centerCenter">
                ${e.peso_actual - e.weightEnd} kg.
              </div>
            </div>
          </div>
        </div>
      </article>`
        })
        return cardsToString;
    }

    return `
    <!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <title>${date}_${product}</title>
  <Style>
  @page {
    margin: 0mm;
  }
    html{
  margin:0;
  box-sizing: border-box;
}
body {
    font-size: 16px;
    text-transform: uppercase;
    font-weight: bolder;
    min-width: 595px;
    min-height: 842px;
    margin: 0px;
    padding:0px;
}
p{
  margin: 2mm;
}
.flex{
  flex: 1;
}
#main{
  flex: 1;
  background-color: transparent;
  padding: 5mm;
}
.simpleContainer{
  display: flex;
  justify-content: start;
  align-items: center;
}
.centerRow{
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
}
.centerColumn{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.startStart{
  display:flex;
  justify-content: flex-start;
  align-items: stretch
}
.startColumn{
  flex-flow: column;
  align-items: center
}
.twoRowBetween{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}
.flexStart{
  display:flex;
  align-items: flex-start;
justify-content: flex-start;
}
.between{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.border{
  border: 2px solid black;
  border-radius: 5px;
}
.rowStreetch{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.textInBox{
  margin: 1mm 3mm;
}
.centerCenter{
  display: flex;
  justify-content: center;
  align-items: center;
}
.centerLeft{
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.centerRight{
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.streetch{
  align-items:  stretch
}
.padL3{
  padding-left: 3mm;
}
.width20{
  width: 20mm;
}
.width30{
  width: 30mm;
}
.widt90{
  width: 90mm;
}
.width60{
  width: 60mm;
}
.width75{
  width: 80mm;
}
.fullWidth{
  width: 100%;
}
.height9{
  height: 7mm;
}
.height12{
  height: 12mm;
}
.height20{
  height: 20mm;
}
.margin2all{
  margin: 2mm;
}
.marginL{
  margin-left: 2mm;
}
.marginXL{
  margin-left: 20mm;
}
.fullMargin2{
  margin: 2mm;
}
.hr{
  width: 100%;
  color: black;
  margin: 3mm 0;
}
table>tr>td{
 text-align: center;
 background-color: #c2c2c2;
}
td{
text-align: center;
}
#cabecera{
 background-color: #c2c2c2;
 padding: 0 2mm;
 border-radius: 5px;
 border: 2px solid black;
}
#rotativa{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
#general{
  width: 70%;
  padding-right: 5mm;
  flex-direction: column;
  align-items: flex-start;
}
#rightAside{
  padding: 3mm;
    margin: 0 1mm;
 width: 30%;
  align-self: stretch;
  padding: 3mm;
}
#productWrite{
  flex:1 1 100%;
}
#writeResponsable{
  flex: 1 1 100%;
  padding-left: 3mm;
}
#totales{
padding-right: 0;
}
#firma{
  margin: 1mm 0 1mm 1mm;
 flex: 1;
  align-self: stretch;
}
#cardRightRow{
  flex: 1;
  padding: 1mm;
}
#cardCode{
  height: 20mm;
}
#numauto{
  font-size: 40px;
    font-weight: bolder;
}
.square{
  width: 60px;
  height: 30px;
  border: 1px solid black;
  margin: .5mm;
}
td{
  width: 10mm;
  height: 10mm;
  border: 1px solid black;
}
table>tr>td{
 text-align: center;
 background-color: #c2c2c2;
}
#main>article.border{
  margin: 2mm 0;
  break-inside: avoid;
span#spanObser{
  text-decoration: underline!important;
  font-style: italic!important;
  color: grey!important;
  }
}
  </Style>
</head>
<body id="body">
  <section id="main">
    <article id="cabecera" class="centerRow">
      <div id="title" class="height9 width90 border centerCenter" style="background-color: white">
        <p>${enterprise}</p>
      </div>
      <h1>PARTE DE ENTRADA BOBINAS A MÁQUINA
      </h1>
      <div class="height9 width30 border centerCenter" style="background-color: white">
        <p>${date}</p>
      </div>
    </article>
    <article id="rotativa">
      <p>MÁQUINA ${prodLine}</p>
    </article>
      <div class="startStart fullWidth">
        <article id="general" class="startStart">
          <div id="producto" class=" simpleContainer" style="width: 100%">
            <p>producto</p>
            <div id="productWrite" class="marginL border width60 height9 centerLeft padL3">
              <p>${product}</p>
            </div>
          </div>
          <div id="ediciones" class="flexStart fullWidth">
            <div class="centerCenter">
                <p>ediciones</p>
                <div class="marginL height9 width30 border centerCenter">
                    <p>${editions}</p>
                </div>
            </div>
            <div class="centerCenter marginL">
                <p class="marginXL">paginación</p>
                <div class="marginL height9 width30 border centerCenter">
                    <p>${pagination}</p>
                </div>
            </div>
          </div>
          <div id="producto" class=" simpleContainer" style="width: 100%">
            <p>trabajador</p>
            <div id="productWrite" class="marginL border width60 height9 centerLeft padL3">
              ${name}
            </div>
          </div>
          <div class="rowStreetch fullWidth" style="border-left: 2px solid black;">
            <div id="totales" class="twoRowBetween width75 marginL">
              <p clasd="childMedium">total tirada</p>
              <div class="border height9 width30 centerCenter">
                <p>${tiradaBruta}</p>
              </div>
              <p class="childMedium">kilos tirada</p>
              <div class="border height9 width30 centerCenter">
                <p>${kilosTirada}</p> 
              </div>
              <p class="childMedium">kilos consumidos</p>
              <div class="border height9 width30 centerCenter">
                <p>${kilosConsumidos}</p>
              </div>
            </div>
            <div id="firma" class="border">
              <p class="textInBox">firma:</p>
            </div>
          </div>
          <div id="responsable" class="fullWidth between">
            <p id="responsable">responsable</p>
            <div id="writeResponsable" class="marginL border height9 centerLeft">   
            </div>
          </div>
        </article>
        <aside id="rightAside" class="column border">
          <div class="between" style="font-size: 10px">
            <p style="margin: 0">X: nueva</p>
            <p style="margin: 0">R: resto</p>
          </div>
          <div id="insertRows" class="centerCenter">
            ${createTable()}
          </div>
        </aside>
      </div>
      <div class="border height20" style="margin-top: 1mm">
        <p style="text-decoration: underline!important;font-style: italic!important;">observaciones:
        <p class="textInBox">${dataTextArea}</p>
      </div>
      <hr class="hr" />
      ${createCards()}
  </section>
</body>
</html>
    `
};

export {
    htmlDefaultTemplate
};