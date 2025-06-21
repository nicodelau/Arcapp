import type { NextApiRequest, NextApiResponse } from 'next';
import Afip from '../../../lib/afip';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const aloquotTypes = await Afip.electronicBillingService.getAliquotTypes();

    if(!aloquotTypes) {
        return res.status(404).json({ error: 'No se encontraron alicuotas' });
    }

    res.status(200).json(aloquotTypes);

}
