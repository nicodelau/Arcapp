import type { NextApiRequest, NextApiResponse } from 'next';
import Afip from '../../../lib/afip';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const salesPoints = await Afip.electronicBillingService.getSalesPoints();


}
