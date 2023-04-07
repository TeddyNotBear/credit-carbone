import mongoose, { Schema, Document } from 'mongoose'

export interface ISCC extends Document {
    id_scc: string,
    scc_address?: string | undefined,
    scc_blockchain?: string | undefined,	
    scc_mint_date?: string | undefined,		
    scc_blockchain_status?: string | undefined,		
    scc_retirement_status?: string | undefined,		
    scc_ghg_value?: string | undefined,		
    scc_farmer_fees?: string | undefined,		
    scc_developer_fees?: string | undefined,		
    scc_minter_registry_fees?: string | undefined,	
    scc_registry?: string | undefined,	
    uco_parcel_id?: string | undefined,	
    uco_parcel_area?: string | undefined,	
    uco_parcel_shapefile?: string | undefined,	
    uco_vintage?: string | undefined,	
    uco_country?: string | undefined,	
    uco_project_id?: string | undefined,	
    uco_primary_crop?: string | undefined,	
    uco_project_type?: string | undefined,	
    uco_project_developer?: string | undefined,	
    scc_uco_id: string,	
    uco_wallet_id?: string | undefined,
    onSale?: boolean,
    onChainId?: number | undefined,
    uploadedBy: string,
}

const sccSchema = new Schema({
    id_scc: { type: String, unique: true, required: true },
    scc_address: { type: String },
    scc_blockchain: { type: String },	
    scc_mint_date: { type: String },		
    scc_blockchain_status: { type: String },		
    scc_retirement_status: { type: String },		
    scc_ghg_value: { type: String },		
    scc_farmer_fees: { type: String },		
    scc_developer_fees: { type: String },		
    scc_minter_registry_fees: { type: String },	
    scc_registry: { type: String },	
    uco_parcel_id: { type: String },	
    uco_parcel_area: { type: String },	
    uco_parcel_shapefile: { type: String },	
    uco_vintage: { type: String },	
    uco_country: { type: String },	
    uco_project_id: { type: String },	
    uco_primary_crop: { type: String },	
    uco_project_type: { type: String },	
    uco_project_developer: { type: String },	
    scc_uco_id: { type: String, required: true  },	
    uco_wallet_id: { type: String },
    onSale: { type: Boolean, default: false },
    onChainId: { type: Number },
    uploadedBy: { type: String, ref: 'User' },
});

sccSchema.pre<ISCC>('save', async function(next: any) {
    try {
        return next();
    } catch (error) {
        return next(error);
    }
});

const SCC = mongoose.model<ISCC>('SCC', sccSchema);

export { SCC }