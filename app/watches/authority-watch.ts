import { KeypairSigner, Umi, generateSigner } from '@metaplex-foundation/umi';
import Config from 'react-native-config';
import * as fs from 'fs';

function createEnvContent(authority: KeypairSigner): string {
    return `NFT_STORAGE_API_KEY=${authority.publicKey}\nAUTHORITY_PRIVATE_KEY=${authority.publicKey}`;
}

function fileExists(path: string): Boolean {
    let exists = true;
    fs.access(path, fs.constants.F_OK, err => {
        if (err) {
            exists = false;
        }
    });

    return exists;
}

// Returns true if authority config exists and valid, false otherwise
export function manageAuthorityConfig(umi: Umi): Boolean {
    
    if (!fileExists('../../.env') || !Config.AUTHORITY_PRIVATE_KEY) {
        const authority = generateSigner(umi);

        if (!authority || !authority.publicKey || !authority.secretKey) {
            console.error('Failed to generate authority');
            throw new Error('Failed to generate authority');
        }
        
        fs.writeFile('../../.env', createEnvContent(authority), err => {
            if (err) {
                console.error('Error writing to .env:', err);
                throw new Error(`Error writing to .env: ${err}`);
            } else {
                console.log('File written successfully.');
            }
        });

        return false;
    }

    return true;
}