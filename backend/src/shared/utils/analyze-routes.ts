// oxlint-disable no-unused-vars
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { RequestMethod } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from 'src/app.module';

interface RouteInfo {
	method: string;
	path: string;
	controller: string;
	handler: string;
}

export async function getAllRoutes() {
	const app = await NestFactory.create(AppModule, { logger: false });
	await app.init();

	const reflector = app.get(Reflector);
	const modules = (app as any).container.getModules();

	const routes: RouteInfo[] = [];

	for (const module of modules.values()) {
		for (const [, wrapper] of module.controllers) {
			const instance = wrapper.instance;
			const metatype = wrapper.metatype;

			if (!instance || !metatype) continue;

			const prototype = Object.getPrototypeOf(instance);
			const controllerPath = reflector.get('path', metatype) || '';

			const methodNames = Object.getOwnPropertyNames(prototype).filter(m => m !== 'constructor');

			for (const methodName of methodNames) {
				const methodRef = prototype[methodName];
				const routePath = reflector.get('path', methodRef);
				const requestMethod = reflector.get('method', methodRef);

				if (routePath && requestMethod !== undefined) {
					const methodStr = Object.entries(RequestMethod).find(
						([key, val]) => val === requestMethod,
					)?.[0] || 'UNKNOWN';

					routes.push({
						method: methodStr,
						path: `${controllerPath}/${routePath}`.replace(/\/+/g, '/'),
						controller: metatype.name,
						handler: methodName,
					});
				}
			}
		}
	}

	await app.close();

	return routes;
}

export async function analyzeRoutes() {
	const routes = await getAllRoutes();

	console.table(routes);
}

if (require.main === module) {

	void (async () => {
		await analyzeRoutes();
	})();
}
