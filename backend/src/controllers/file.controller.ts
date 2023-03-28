import { UCO, IUCO } from './../models/uco.model';
import { SCC, ISCC } from './../models/scc.model';

// import { create } from 'ipfs-core';

export class FileController {

    public async generateJsonFiles(jsonData: Array<any>, type: string, userEmail: string) {
        jsonData.map((data: any) => {
            if(type === 'UCO') this.createUCOInDB(data, userEmail);
            if(type === 'SCC') this.createSCCInDB(data, userEmail);
        })
    }

    public async createUCOInDB(data: IUCO, userEmail: string) {
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
        return UCO.find(filter);
    }

    public async getUserSCC(userEmail: string) {
        const filter = { uploadedBy: userEmail };
        return SCC.find(filter);
    }

    /*public async uploadToIPFS(jsonData: Array<string>) {
        const node = await create({ repo: "Credit Carbone" + Math.random() });
        let ipfsHashArr: Array<string> = [];
        if(jsonData && jsonData.length > 0) {
            for(const json in jsonData) {
                const fileAdded = await node.add({ content: JSON.stringify(jsonData[json]) });
                if(fileAdded) {
                    ipfsHashArr.push(fileAdded.path)
                }
            }
        }
        return ipfsHashArr;
    }*/

}