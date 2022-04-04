import { Module, DynamicModule } from '@nestjs/common';
import { GrammyCoreModule } from './grammy-core.module';
import { GrammyModuleOptions, GrammyModuleAsyncOptions } from './interfaces';

@Module({})
export class GrammyModule {
  public static forRoot(options: GrammyModuleOptions): DynamicModule {
    return {
      module: GrammyModule,
      imports: [GrammyCoreModule.forRoot(options)],
      exports: [GrammyCoreModule],
    };
  }

  public static forRootAsync(options: GrammyModuleAsyncOptions): DynamicModule {
    return {
      module: GrammyModule,
      imports: [GrammyCoreModule.forRootAsync(options)],
      exports: [GrammyCoreModule],
    };
  }
}
