const htmlDefaultTemplate = (dataProduction, prodResult, cardsData, numAutopastersLine) => {
    const {date, prodLine, pagination, product, editions} = dataProduction;
    const {kilosConsumidos, kilosTirada, tiradaBruta} = prodResult;
    //falta: trabajador, empresa
    const restos = (data, autopasters, secondInd, firstInd) => {
        const d = data.filter(item => item.auto === autopasters[secondInd])[firstInd];
        console.log(d)
        if (!d) {
            return ''
        } else if (d.weightIni === d.weightAct) {
            return 'X'
        } else {
            return 'R'
        }

    };
    cardsData.sort((a, b) => a.autopaster - b.autopaster);
    const repeatNum = data.reduce((acc, item) => {
        acc[item.auto] = (acc[item.auto] || 0) + 1;
        return acc;
    }, {});

    let maxRepeat = Object.values(repeatNum).sort((a, b) => b - a)[0];
    let autopasters = numAutopastersLine;

    const createTable = () => {
        let tabla = "<table border='0'><tr>";
        for (let j = 0; j < autopasters.length; j++) {
            tabla += "<td style='text-align: center; background-color: #c2c2c2;'>" + (autopasters[j]) + "</td>";
        }
        tabla += "</tr>";

        for (let i = 0; i < maxRepeat; i++) {
            tabla += "<tr>";
            for (let j = 0; j < autopasters.length; j++) {
                tabla += "<td style='text-align: center'>" + restos(data, autopasters, j, i) + "</td>";
            }
            tabla += "</tr>";
        }
        tabla += "</table>";
        return tabla;
    }
    const createCards = () => {
        let cardsToString = '';
        cardsData.forEach(e => {
            let comsumption = e.weightIni - e.weightEnd;
            cardsToString = cardsToString +
            `
                 <article  class="border">
        <div class="twoRowBetween">
          <div id="cardLeftRow" class="twoRowBetween" style=" align-self: stretch">
            <div class="startColumn" style="height:100%">
              <p style="text-align: center; margin: 1mm;">cuerpo</p>
              <div id="numauto" class="border height20 width20 centerCenter margin2all">
                <p>${e.autopaster}</p>
              </div>
            </div>
            <div class="centerColumn" style="padding: 3mm">
              <div class="centerRight">
                <p>resto inicio</p>
                <div class="border marginL width20 height9 centerCenter">
                  <p>${e.weightIni}</p>
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
            +
            e.codepathSVG.length > 0 ?
                `<svg height="20mm" width="100" fill="#000000">
                    <path d="${e.codepathSVG}" />
                </svg>
                <p style="text-align: center">${e.bobinaID}</p>`
                :
                <p>${e.bobinaID}</p>
                +
                `</div>
            <div id="cardFinally" class="centerRight pad3">
              <p>consumido</p>
              <div class="marginL border height9 width30 centerCenter">
                ${comsumption}
              </div>
            </div>
          </div>
        </div>
      </article>
      `
        })
        return cardsToString;
    }


    // Object {
    //     "autopaster": 5,
    //         "bobinaID": 3057060277853,
    //         "codepathSVG": 0,
    //         "ismedia": 0,
    //         "position": 1,
    //         "radius": 0,
    //         "radiusIni": null,
    //         "toSend": true,
    //         "weightAct": 600,
    //         "weightEnd": 0,
    //         "weightIni": 700,
    // },

    return `
    <!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>Default Template</title>

  <!-- HTML -->


  <!-- Custom Styles -->
  <!--<link rel="stylesheet" href="style.css">-->
  <Style>
    html{
  margin:0;
  padding: 5mm;
  box-sizing: border-box;
}
body {
    font-size: 16px;
    text-transform: uppercase;
    font-weight: bolder;
    border: 2px solid #c2c2c2;
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
  margin: 5mm;
  padding: .5mm;
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
.width55{
  width: 55mm;
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
#cabecera{
 background-color: #c2c2c2;
 padding: 0 2mm;
 border-radius: 5px;
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
  font-size: 50px;
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
#main>article.flex1.border{
  margin: 2mm 0;
  break-inside: avoid;
}
  </Style>
</head>

<body id="body">
  <section id="main">
    <article id="cabecera" class="centerRow">
      <div id="title" class="height9 width55 border centerCenter" style="background-color: white">
        <p>**empresa**</p>
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
          <div id="ediciones" class="centerRow fullWidth">
            <p>ediciones</p>
            <div class="marginL height9 width30 border centerCenter">
              <p>${editions}</p>
            </div>
            <p class="marginXL">paginación</p>
            <div class="marginL height9 width30 border centerCenter">
              <p>${pagination}</p>
            </div>
          </div>
          <div id="producto" class=" simpleContainer" style="width: 100%">
            <p>trabajador</p>
            <div id="productWrite" class="marginL border width60 height9 centerLeft padL3">
              ***
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
        <p class="textInBox">observaciones:</p>
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