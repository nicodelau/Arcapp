import type { NextApiRequest, NextApiResponse } from 'next';
import Afip from '../../../lib/afip';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const taxTypes = await Afip.electronicBillingService.getTaxTypes();

    if(!taxTypes) {
        return res.status(404).json({ error: 'No se encontraron tipos de opciones' });
    }

    res.status(200).json(taxTypes);


}
