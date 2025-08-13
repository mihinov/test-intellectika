// oxlint-disable no-unused-vars

import { INestApplication, RequestMethod } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

interface RouteInfo {
	method: string;
	path: string;
	controller: string;
	handler: string;
}

export async function getAllRoutes(app: INestApplication): Promise<RouteInfo[]> {
  const reflector = app.get(Reflector);
  const modules = (app as any).container.getModules();
  const routes: RouteInfo[] = [];

  // Попытка достать глобальный префикс
  let globalPrefix = '';
  try {
    if (typeof (app as any).config?.getGlobalPrefix === 'function') {
      globalPrefix = (app as any).config.getGlobalPrefix() || '';
    } else if ((app as any).config?.globalPrefix) {
      globalPrefix = (app as any).config.globalPrefix || '';
    }
  } catch {
    globalPrefix = '';
  }

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
            ([, val]) => val === requestMethod,
          )?.[0] || 'UNKNOWN';

          routes.push({
            method: methodStr,
            path: `/${globalPrefix}/${controllerPath}/${routePath}`.replace(/\/+/g, '/'),
            controller: metatype.name,
            handler: methodName,
          });
        }
      }
    }
  }

  return routes;
}

export async function analyzeRoutes(app: INestApplication) {
  const routes = await getAllRoutes(app);
  console.table(routes);
}
