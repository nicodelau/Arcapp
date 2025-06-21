import type { NextApiRequest, NextApiResponse } from 'next';
import Afip from '../../../lib/afip';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const currenciesTypes =  await Afip.electronicBillingService.getCurrenciesTypes();

    if(!currenciesTypes) {
        return res.status(404).json({ error: 'No se encontraron monedas' });
    }

    res.status(200).json(currenciesTypes);


}
