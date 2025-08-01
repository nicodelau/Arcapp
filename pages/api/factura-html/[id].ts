// pages/api/factura-html/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const host = req.headers.host;
  const origin = `${protocol}://${host}`;

  try {
    const facturaRes = await fetch(
      `${origin}/api/arcapp/comprobantes?id=${id}`,
      { headers: { 'Content-Type': 'application/json' }, method: 'GET' }
    );

    console.log(`${origin}/api/arcapp/comprobantes?id=${id}`)

    if (!facturaRes.ok) {
      console.error('Error al obtener comprobante:', facturaRes.status);
      res.status(facturaRes.status).end();
      return; // evitar continuar
    }

    const factura = await facturaRes.json();

    console.log(factura)

    const html = `<!DOCTYPE html>
<html>
<head>
	<title>Factura</title>
	<style type="text/css">
		*{
			box-sizing: border-box;
			-webkit-user-select: none; /* Chrome, Opera, Safari */
			-moz-user-select: none; /* Firefox 2+ */
			-ms-user-select: none; /* IE 10+ */
			user-select: none; /* Standard syntax */
		}
		.bill-container{
			width: 750px;
			position: absolute;
			left:0;
			right: 0;
			margin: auto;
			border-collapse: collapse;
			font-family: sans-serif;
			font-size: 13px;
		}

		.bill-emitter-row td{
			width: 50%;
			border-bottom: 1px solid; 
			padding-top: 10px;
			padding-left: 10px;
			vertical-align: top;
		}
		.bill-emitter-row{
			position: relative;
		}
		.bill-emitter-row td:nth-child(2){
			padding-left: 60px;
		}
		.bill-emitter-row td:nth-child(1){
			padding-right: 60px;
		}

		.bill-type{
			border: 1px solid;
			border-top: 1px solid; 
			border-bottom: 1px solid; 
			margin-right: -30px;
			background: white;
			width: 60px;
			height: 50px;
			position: absolute;
			left: 0;
			right: 0;
			top: -1px;
			margin: auto;
			text-align: center;
			font-size: 40px;
			font-weight: 600;
		}
		.text-lg{
			font-size: 30px;
		}
		.text-center{
			text-align: center;
		}

		.col-2{
			width: 16.66666667%;
			float: left;
		}
		.col-3{
			width: 25%;
			float: left;
		}
		.col-4{
			width: 33.3333333%;
			float: left;
		}
		.col-5{
			width: 41.66666667%;
			float: left;
		}
		.col-6{
			width: 50%;
			float: left;
		}
		.col-8{
			width: 66.66666667%;
			float: left;
		}
		.col-10{
			width: 83.33333333%;
			float: left;
		}
		.row{
			overflow: hidden;
		}

		.margin-b-0{
			margin-bottom: 0px;
		}

		.bill-row td{
			padding-top: 5px
		}

		.bill-row td > div{
			border-top: 1px solid; 
			border-bottom: 1px solid; 
			margin: 0 -1px 0 -2px;
			padding: 0 10px 13px 10px;
		}
		.row-details table {
			border-collapse: collapse;
			width: 100%;
		}
		.row-details td > div, .row-qrcode td > div{
			border: 0;
			margin: 0 -1px 0 -2px;
			padding: 0;
		}
		.row-details table td{
			padding: 5px;
		}
		.row-details table tr:nth-child(1){
			border-top: 1px solid; 
			border-bottom: 1px solid; 
			background: #c0c0c0;
			font-weight: bold;
			text-align: center;
		}
		.row-details table tr +  tr{
			border-top: 1px solid #c0c0c0; 
			
		}
		.text-right{
			text-align: right;
		}

		.margin-b-10 {
			margin-bottom: 10px;
		}

		.total-row td > div{
			border-width: 2px;
		}

		.row-qrcode td{
			padding: 10px;
		}		

		#qrcode {
			width: 50%
		}
	</style>
</head>
<body>
	<table class="bill-container">
		<tr class="bill-emitter-row">
			<td>
				<div class="bill-type">
					B
				</div>
				<div class="text-lg text-center">
					Harinas San Miguel
				</div>
				<p><strong>Razón social:</strong> Harinas San Miguel</p>
				<p><strong>Domicilio Comercial:</strong> Gaspar campos 4055</p>
				<p><strong>Condición Frente al IVA:</strong> Responsable inscripto</p>
			</td>
			<td>
				<div>
					<div class="text-lg">
						Factura
					</div>
					<div class="row">
						<p class="col-6 margin-b-0">
							<strong>Punto de Venta: 0003</strong>
						</p>
						<p class="col-6 margin-b-0">
							<strong>Comp. Nro: ${factura.id}</strong> 
						</p>
					</div>
					<p><strong>Fecha de Emisión:</strong> ${factura.cbteFch}</p>
					<p><strong>CUIT:</strong> algun cuit</p>
					<p><strong>Ingresos Brutos:</strong> algun iibb</p>
					<p><strong>Fecha de Inicio de Actividades:</strong> 25/10/2023</p>
				</div>
			</td>
		</tr>
		<tr class="bill-row">
			<td colspan="2">
				<div class="row">
					<p class="col-4 margin-b-0">
						<strong>Período Facturado Desde: </strong>25/10/2023
					</p>
					<p class="col-3 margin-b-0">
						<strong>Hasta: </strong>25/10/2023
					</p>
					<p class="col-5 margin-b-0">
						<strong>Fecha de Vto. para el pago: </strong>25/10/2023
					</p>
				</div>
			</td>
		</tr>
		<tr class="bill-row">
			<td colspan="2">
				<div>
					<div class="row">
						<p class="col-4 margin-b-0">
							<strong>CUIL/CUIT: </strong>12345678912
						</p>
						<p class="col-8 margin-b-0">
							<strong>Apellido y Nombre / Razón social: </strong>Pepe perez
						</p>
					</div>
					<div class="row">
						<p class="col-6 margin-b-0">
							<strong>Condición Frente al IVA: </strong>Consumidor final
						</p>
						<p class="col-6 margin-b-0">
							<strong>Domicilio: </strong>Calle falsa 123
						</p>
					</div>
					<p>
						<strong>Condicion de venta: </strong>Efectivo
					</p>
				</div>
			</td>
		</tr>
		<tr class="bill-row row-details">
			<td colspan="2">
				<div>
					<table>
						<tr>
							<td>Código</td>
							<td>Producto / Servicio</td>
							<td>Cantidad</td>
							<td>U. Medida</td>
							<td>Precio Unit.</td>
							<td>% Bonif.</td>
							<td>Imp. Bonif.</td>
							<td>Subtotal</td>
						</tr>
						    
							<tr>
								<td>321</td>
								<td>Madera</td>
								<td>1,00</td>
								<td>Unidad</td>
								<td>150,00</td>
								<td>0,00</td>
								<td>0,00</td>
								<td>150,00</td>
							</tr>
							
					</table>
				</div>
			</td>
		</tr>
		<tr class="bill-row total-row">
			<td colspan="2">
				<div>
					<div class="row text-right">
						<p class="col-10 margin-b-0">
							<strong>Subtotal: $</strong>
						</p>
						<p class="col-2 margin-b-0">
							<strong>150,00</strong>
						</p>
					</div>
					<div class="row text-right">
						<p class="col-10 margin-b-0">
							<strong>Importe Otros Tributos: $</strong>
						</p>
						<p class="col-2 margin-b-0">
							<strong>0,00</strong>
						</p>
					</div>
					<div class="row text-right">
						<p class="col-10 margin-b-0">
							<strong>Importe total: $</strong>
						</p>
						<p class="col-2 margin-b-0">
							<strong>150,00</strong>
						</p>
					</div>
				</div>
			</td>
		</tr>
		<tr class="bill-row row-details">
			<td>
				<div>
					<div class="row">
						<img id="qrcode" src="data:image/png;base64,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">
					</div>
				</div>
			</td>
			<td>
				<div>
					<div class="row text-right margin-b-10">
						<strong>CAE Nº:&nbsp;</strong> 12345678912345
					</div>
					<div class="row text-right">
						<strong>Fecha de Vto. de CAE:&nbsp;</strong> 05/11/2023
					</div>
				</div>
			</td>
		</tr>
		<tr class="bill-row row-details">
			<td colspan="2">
				<!-- <div>
					<div class="row text-center margin-b-10">
						<span class="vertical-align:bottom">Generado con Afip SDK</span>
						<img style="height: 20px;vertical-align: middle;" src="https://afipsdk.com/faviconx32.png" alt="📦" />
					</div>
				</div> -->
			</td>
		</tr>
	</table>
</body>
</html>
`;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
