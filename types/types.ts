type Producto = {
    descripcion?: string;
    cantidad?: number;
    precioUnitario?: number;
    total?: number;
    id_arca?: number;
    id?: number;
};

type Comprobante = {
    idIVAReceptor?: string | null;
    PtoVtatipoCbte?: number | null;
    CbteTipoconcepto?: number | null;
    ConceptodocTipo?: number | null;
    docNro?: number | null;
    DocNrocbteDesde?: number | null;
    CbteDesdecbteHasta?: number | null;
    CbteHastacbteFch?: string | null;
    impTotal?: number | null;
    ImpTotalimpTotConc?: number | null;
    ImpTotConcimpNeto?: number | null;
    impOpEx?: number | null;
    impIVA?: number | null;
    ImpIVAimpTrib?: number | null;
    monId?: string | null;
    MonIdcreatedAt?: string | null;
    MonCotizivaItems?: { Id: number; BaseImp: number; Importe: number }[];
    Productos?: Producto[];
    CbtesAsoc?: { Tipo: number; PtoVta: number; Nro: number }[];
    cbteFch?: string | null;
    cae?: string;
};

type ComprobanteAfip = {
    CantReg?: number;
    PtoVta?: number;
    CbteTipo?: number;
    Concepto?: number;
    DocTipo?: number;
    DocNro?: number;
    CbteDesde?: number;
    CbteHasta?: number;
    CbteFch?: number;
    ImpTotal?: number;
    ImpTotConc?: number;
    ImpNeto?: number;
    ImpOpEx?: number;
    ImpIVA?: number;
    ImpTrib?: number;
    MonId?: number;
    MonCotiz?: number;
    CbtesAsoc?: { Tipo: number; PtoVta: number; Nro: number }[];
    Iva?: Array<{
        Id: number;
        BaseImp: number;
        Importe: number;
    }>;
}


// [
//     {
//         "Id": 1,
//         "Desc": "IVA Responsable Inscripto",
//         "Cmp_Clase": "A/M/C"
//     },
//     {
//         "Id": 6,
//         "Desc": "Responsable Monotributo",
//         "Cmp_Clase": "A/M/C"
//     },
//     {
//         "Id": 13,
//         "Desc": "Monotributista Social",
//         "Cmp_Clase": "A/M/C"
//     },
//     {
//         "Id": 16,
//         "Desc": "Monotributo Trabajador Independiente Promovido",
//         "Cmp_Clase": "A/M/C"
//     },
//     {
//         "Id": 4,
//         "Desc": "IVA Sujeto Exento",
//         "Cmp_Clase": "B/C"
//     },
//     {
//         "Id": 5,
//         "Desc": "Consumidor Final",
//         "Cmp_Clase": "B/C"
//     },
//     {
//         "Id": 7,
//         "Desc": "Sujeto No Categorizado",
//         "Cmp_Clase": "B/C"
//     },
//     {
//         "Id": 8,
//         "Desc": "Proveedor del Exterior",
//         "Cmp_Clase": "B/C"
//     },
//     {
//         "Id": 9,
//         "Desc": "Cliente del Exterior",
//         "Cmp_Clase": "B/C"
//     },
//     {
//         "Id": 10,
//         "Desc": "IVA Liberado – Ley N° 19.640",
//         "Cmp_Clase": "B/C"
//     },
//     {
//         "Id": 15,
//         "Desc": "IVA No Alcanzado",
//         "Cmp_Clase": "B/C"
//     }
// ]