import { UCO, IUCO } from './../models/uco.model.js';
import { SCC, ISCC } from './../models/scc.model.js';

import { create } from 'ipfs-http-client';

export class FileController {

    public async generateJsonFiles(jsonData: Array<any>, type: string, userEmail: string) {
        jsonData.map((data: any) => {
            if(type === 'UCO') this.createUCOInDB(data, userEmail);
            if(type === 'SCC') this.createSCCInDB(data, userEmail);
        })
    }

    public async createUCOInDB(data: IUCO, userEmail: string) {
        try {   
            const uco: IUCO = new UCO({
                ...data,
                uploadedBy: userEmail
            });
            await uco.save();
        } catch (error) {
            console.log(error);
        }
    }

    public async createSCCInDB(data: ISCC, userEmail: string) {
        try {
            const scc: ISCC = new SCC({
                ...data,
                uploadedBy: userEmail
            });
            await scc.save(); 
        } catch (error) {
            console.log(error);
        }
    }

    public async getUserUCO(userEmail: string) {
        const filter = { uploadedBy: userEmail };
        return UCO.find(filter).sort({ id_uco: 'asc' }).exec();
    }

    public async getUserSCC(userEmail: string) {
        const filter = { uploadedBy: userEmail };
        return SCC.find(filter).sort({ id_scc: 'asc' }).exec();;
    }

    public async ownershipVerification(userUCOs: any, jsonData: Array<any>): Promise<boolean> {
        let sccUcoIdArr: Array<string> = [];
        jsonData.forEach((scc: ISCC) => sccUcoIdArr.push(scc.scc_uco_id));

        let uniquenessDataId = sccUcoIdArr.filter((sccUcoId: string, index: any) => {
            return sccUcoIdArr.indexOf(sccUcoId) === index;
        });

        let idUcoOwnedByUserArr: Array<string> = [];
        userUCOs.forEach((uco: IUCO) => idUcoOwnedByUserArr.push(uco.id_uco));

        let isValid: boolean = true;
        uniquenessDataId.forEach((data: any) => {
            // Possibilité de récupérer les UCO exacts que l'utilisateur ne possède pas
            if( idUcoOwnedByUserArr.indexOf(data) < 0 ) {
                isValid = false;
                return isValid;
            }
        });

        return isValid;
    }

    public async updateUCORetirementStatus(jsonData: Array<any>) {
        jsonData.forEach(async (scc: ISCC) => {
            const filter = { id_uco: scc.scc_uco_id };
            const update = { uco_retirement_status: 'Retired' };
            console.log(scc.scc_uco_id);
            await UCO.findOneAndUpdate(filter, update, { new: true });
        });
    }

    public async uploadToIPFS(jsonData: Array<any>) {
        const auth = 'Basic ' + Buffer.from(process.env["INFURA_PROJECT_ID"] + ':' + process.env["INFURA_SECRET_KEY"]).toString('base64');
        const ipfs = await create({
            host: 'ipfs.infura.io',
            port: 5001,
            protocol: 'https',
            headers: {
                authorization: auth,
            },
        });

        let ipfsHashArr: Array<string> = [];
        if(jsonData && jsonData.length > 0) {
            for(const json in jsonData) {
                const content = JSON.stringify(jsonData[json]);
                await ipfs.add(content).then(result => {
                    ipfsHashArr.push(result.cid.toString());
                }).catch(error => {
                    console.error(error);
                });
            }
        }
        
        // await ipfs.stop();

        return ipfsHashArr;
    }

}