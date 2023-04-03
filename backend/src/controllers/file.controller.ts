import { UCO, IUCO } from './../models/uco.model.js';
import { SCC, ISCC } from './../models/scc.model.js';

import { create } from 'ipfs-core';

export class FileController {

    public async generateJsonFiles(jsonData: Array<any>, type: string, userEmail: string) {
        console.log(jsonData);
        jsonData.map((data: any) => {
            if(type === 'UCO') this.createUCOInDB(data, userEmail);
            if(type === 'SCC') this.createSCCInDB(data, userEmail);
        })
    }

    public async createUCOInDB(data: IUCO, userEmail: string) {
        console.log('data', data)
        const uco: IUCO = new UCO({
            ...data,
            uploadedBy: userEmail
        });
        await uco.save();
    }

    public async createSCCInDB(data: ISCC, userEmail: string) {
        const scc: ISCC = new SCC({
            ...data,
            uploadedBy: userEmail
        });
        await scc.save();
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

    public async uploadToIPFS(jsonData: Array<string>) {
        const node = await create({ repo: "Credit-Carbone" + Math.random() });

        let ipfsHashArr: Array<string> = [];
        if(jsonData && jsonData.length > 0) {
            for(const json in jsonData) {
                const fileAdded = await node.add({ content: JSON.stringify(jsonData[json]) });
                if(fileAdded) {
                    ipfsHashArr.push(fileAdded.path)
                }
            }
        }
        
        await node.stop();
        
        return ipfsHashArr;
    }

}