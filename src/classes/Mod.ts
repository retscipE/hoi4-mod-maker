import { writeFileSync, rmSync, mkdirSync, existsSync } from "fs";
import path = require("path");

export class Mod {
    #name: string;
    #description: string;
    #version: string;
    #tags: string[];
    #supported_version: string;
    #dependencies: string[] | undefined;

    constructor(options: { 
        name: string; 
        description: string; 
        version: string; 
        tags: string[]; 
        supported_hoi4_version: string; 
        dependencies?: string[];
    }) {
        this.#name = options.name;
        this.#description = options.description;
        this.#version = options.version;
        this.#tags = options.tags;
        this.#supported_version = options.supported_hoi4_version;
        this.#dependencies = options.dependencies;
    }

    public async convertToDescriptor(): Promise<void> {
        const edittedTags = [];
        this.#tags.forEach(tag => edittedTags.push(`"${tag}"`))
        const tagsList = edittedTags.join(`\n`)
        
        try {
            if (existsSync(`./${this.#name}/`)) rmSync(path.join(`./${this.#name}/`), { recursive: true, force: true });
        
            mkdirSync(path.join(`./${this.#name}/`))
            if (this.#dependencies !== undefined) {
                const edittedDependencies = [];
                this.#dependencies.forEach(dependency => edittedDependencies.push(`"${dependency}"`))
                const dependencyList = edittedDependencies.join(`\n`)

                writeFileSync(
                    `./${this.#name}/descriptor.mod`,
                    `name="${this.#name}"\ndescription="${this.#description}"\nversion="${this.#version}"\ntags={\n${tagsList}\n}\ndependencies={\n${dependencyList}\n}\nsupported_hoi4_version="${this.#supported_version}"`,
                    `utf-8`
                )
            } else {
                writeFileSync(
                    `./${this.#name}/descriptor.mod`,
                    `name="${this.#name}"\ndescription="${this.#description}"\nversion="${this.#version}"\ntags={\n${tagsList}\n}\nsupported_hoi4_version="${this.#supported_version}"`,
                    `utf-8`
                )
            }
        } catch (error) {
            throw new Error("Something went wrong...")
        }
    }
}