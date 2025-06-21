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
    Iva?: Array<{
        Id: number;
        BaseImp: number;
        Importe: number;
    }>;
}