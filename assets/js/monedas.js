let selectMoneda = ""
let monedas = {};
let myChart, chart, simbolo;
const endpoint = "https://mindicador.cl/api/";
const config = {
    type: "bar",
    data: {}
};

window.onload = function(){
    myChart = document.getElementById("myChart");
    myChart.style.backgroundColor = "white";
       
    chart = new Chart(myChart, config);
}

async function getMonedas(x){
    try {     
        const res = await fetch(x);
        monedas = await res.json();
    } 
    catch (e) {
        console.log("Error ocurrido: ",e.message)
    }
 
}

async function render(){
    await getMonedas(endpoint)
    
    selectMoneda = document.querySelector("#selectMoneda").value
    let clp = document.querySelector("#clp").value
    let resultado = document.querySelector("#resultado")
    let html = "";
    if (isNaN(clp) == true || clp <= 0 || selectMoneda == "predeterminado"){
        alert("Debe ingresar un valor numérico mayor a 0 y/o seleccionar una moneda")
    }else{
        renderGrafica();
        for (const key in monedas) {
            if (monedas[key]["codigo"] == selectMoneda){
                if (selectMoneda == "dolar"){
                    simbolo = "$"
                }
                else{
                    simbolo = "€"
                }
                console.log(simbolo)
                let cambio = clp / monedas[key].valor
                let redondeaCambio = cambio.toFixed(2);        
                html += `
                <h5 class="text-light">Resultado: ${redondeaCambio} ${simbolo}</h3>
                `
                
            } 
        }
    }       
    
    resultado.innerHTML = html;

}

async function getAndCreateDataToChart() {
    const res = await fetch(endpoint+selectMoneda);
    const fechasyValor = await res.json();
    const labelsTotal = fechasyValor.serie.map((elemento) => {
        return elemento.fecha.split("T")[0];
    
    });
    const labels = labelsTotal.slice(0,10);
    console.log("🚀 ~ file: monedas.js ~ line 66 ~ getAndCreateDataToChart ~ labelsFiltradas", labels)
    const dataTotal = fechasyValor.serie.map((elemento) => {
        return elemento.valor
    })
    const data = dataTotal.slice(0,10);
    console.log("🚀 ~ file: monedas.js ~ line 72 ~ getAndCreateDataToChart ~ data", data)

    const datasets = [
        {
            label: "Valores "+selectMoneda,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            data
        }
        ];
   
    return { labels, datasets };

}

async function renderGrafica() {
    let data = await getAndCreateDataToChart();
    let datasets = data.datasets;
    let label = data.labels;
    chart.data = "";
    chart.data = data
    chart.update();

}
