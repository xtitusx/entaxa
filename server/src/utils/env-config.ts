import chalk from 'chalk';
import * as dotenv from 'dotenv';

/**
 * @class EnvConfig
 */
export class EnvConfig {
    /**
     * Méthode qui charge les variables d'environnement.
     */
    public static loadEnvFile() {
        let path: string;

        switch (process.env.NODE_ENV) {
            case 'test':
                path = `${__dirname}/../../.env.test`;
                break;
            case 'production':
                path = `${__dirname}/../../.env.production`;
                break;
            default:
                path = `${__dirname}/../../.env.development`;
        }

        const config = dotenv.config({ path: path });

        console.log(
            `Chargement des variables d'environnement = ${
                config.error
                    ? chalk.redBright('[' + config.error.message + ']')
                    : chalk.blueBright('[' + JSON.stringify(config.parsed) + ']')
            }`
        );
    }
}
