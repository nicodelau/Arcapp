import type { NextApiRequest, NextApiResponse } from 'next';
import Afip from '../../../lib/afip';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const documentTypes = await Afip.electronicBillingService.getDocumentTypes();

    if(!documentTypes) {
        return res.status(404).json({ error: 'No se encontraron tipos de opciones' });
    }

    res.status(200).json(documentTypes);


}
