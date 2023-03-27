export interface IUCO {
    id_uco: string, // Id unique de l'UCO interne. ex?: uco_2023_0000000001
    uco_address?: string | undefined, // Adresse de l'UCO dans la blockchain
    uco_blockchain?: string | undefined,
    uco_mint_date: string, // Date et heure de création de l'UCO
    uco_blockchain_status?: string | undefined, // Minted / Transfered / Burnt ???
    uco_retirement_status?: string | undefined, // Issued / Retired
    uco_registry: string, // ex?: Farm Registry
    uco_parcel_id_n_1: string, // 
    uco_parcel_id?: number | undefined, // Numérotation interne de la parcelle à partir du numéro de l'ilot. ex?: 3537758127
    uco_parcel_area: number, // ex?: 45 | undefined,02
    uco_parcel_shapefile?: string | undefined, // Lien vers fichier geojson de la parcelle
    uco_vintage: number, // ex?: 2022
    uco_country?: string | undefined, // ex?: France
    uco_project_id?: number | undefined, // ex?: p20220001
    uco_primary_crop?: string | undefined, // ex?: Rapeseed
    uco_project_type?: string | undefined, // Regenerative Agriculture / Solar
    uco_project_developer: string, // Axereal
    uco_wallet_id?: string | undefined, // ex ?: wd1000001
}