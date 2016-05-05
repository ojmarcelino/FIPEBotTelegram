'use strict'
var http = require('http');
var request = require('request');
var bot = require('telegram-node-bot')('232821568:AAHnvUJDkDoMl2ybaltD12DRjs61TOZiTWQ');

bot.router.
    when(['/help'], 'StartController').
    when(['/marcas :tipo'], 'MarcasController').
    when(['/veiculos :tipo :id_marca'], 'VeiculosController').
    when(['/modelo :tipo :id_marca :id_veiculo'], 'ModeloController').
    when(['/fipe :tipo :id_marca :id_veiculo :ano :combustivel'], 'FipeController')
    
    // otherwise('StartController')
    
bot.controller('StartController', ($) => {

    $.sendMessage("/marcas tipo\n /veiculos tipo id_marca\n /modelo tipo id_marca id_veiculo\n /fipe tipo id_marca id_veiculo ano combustivel\n\n\nTipo: carros, motos ou caminhoes\nId_Marca: ID informado ao listar os tipos.\nID_Veiculo: ID informado ao lista a marca.\nAno: Numeral com 4 casas decimais\nCombustivel: gasolina, alcool ou diesel");

})

bot.controller('MarcasController', ($) => {
    bot.for('/marcas :tipo', ($) => {
        getMarcas($.query.tipo, function (data) {
            console.log('Listado marcas')
            for (var i=0; i < 5; i++) {
                $.sendMessage(data[i].id + ' - ' + data[i].name)
            }
        })
    })
})

bot.controller('VeiculosController', ($) => {
    bot.for('/veiculos :tipo :id_marca', ($) => {
        getVeiculos($.query.tipo, $.query.id_marca, function (data) {
            console.log('Listado Veiculos')
            for (var i=0; i < 5; i++) {
                $.sendMessage(data[i].id + ' - ' + data[i].name)
            }
        })
    })
})

bot.controller('ModeloController', ($) => {
    bot.for('/modelo :tipo :id_marca :id_veiculo', ($) => {
        getModelo($.query.tipo, $.query.id_marca, $.query.id_veiculo, function (data) {
            console.log('Listado Modelos')
            for (var i=0; i < data.length; i++) {
                $.sendMessage(data[i].id + ' - ' + data[i].name)
            }
        })
    })
})


bot.controller('FipeController', ($) => {
    bot.for('/fipe :tipo :id_marca :id_veiculo :ano :combustivel', ($) => {
        getFipe($.query.tipo, $.query.id_marca, $.query.id_veiculo, $.query.ano, $.query.combustivel, function (data) {
            console.log('Veiculo localizado')
            $.sendMessage('Id :'+data.id+'\nNome: '+data.name+'\nMarca: '+data.marca+'\nAno: '+data.ano_modelo+'\nCombustivel :'+data.combustivel+'\nPreço: '+data.preco+'\nCodigo Fipe: '+data.fipe_codigo+'\nReferencia :'+data.referencia)
        })
    })
})

function getMarcas(tipo, callback){
    //GET: http://fipeapi.appspot.com/api/1/carros/marcas.json
    var url = 'http://fipeapi.appspot.com/api/1/'+tipo+'/marcas.json'
    
    return request({
            url: url,
            json: true
        }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(body)
        } else {
            console.log(error);
        }
    })
}

function getVeiculos(tipo, id_marca, callback) {
    //GET: http://fipeapi.appspot.com/api/1/carros/veiculos/21.json
    var url = 'http://fipeapi.appspot.com/api/1/'+tipo+'/veiculos/'+id_marca+'.json'
    
    return request({
            url: url,
            json: true
        }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(body)
        } else {
            console.log(error);
        }
    })
}

function getModelo(tipo, id_marca, id_veiculo, callback){
    //GET: http://fipeapi.appspot.com/api/1/carros/veiculo/21/4828.json
    var url = 'http://fipeapi.appspot.com/api/1/'+tipo+'/veiculo/'+id_marca+'/'+id_veiculo+'.json'
    
    return request({
            url: url,
            json: true
        }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(body)
        } else {
            console.log(error);
        }
    })
}

function getFipe(tipo, id_marca, id_veiculo, ano, combustivel, callback){
    //GET: http://fipeapi.appspot.com/api/1/carros/veiculo/21/4828/2013-1.json
    if (combustivel === 'gasolina'){
        combustivel = 1;
    } else if (combustivel === 'alcool'){
        combustivel = 2;
    } else if (combustivel === 'diesel'){
        combustivel = 3;
    }
    
    var url = 'http://fipeapi.appspot.com/api/1/'+tipo+'/veiculo/'+id_marca+'/'+id_veiculo+'/'+ano+'-'+combustivel+'.json'
    
    return request({
            url: url,
            json: true
        }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(body)
        } else {
            console.log(error);
        }
    })
}