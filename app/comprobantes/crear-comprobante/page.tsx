import FacturaForm from "../../components/FacturaForm";

export default function CrearComprobantePage() {
  console.log(process.env.CUIT);
  console.log(process.env.ARCA_WS_CRT_B64);
  console.log(process.env.ARCA_WS_KEY_B64);

  return <FacturaForm />;
}
