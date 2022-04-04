import { DiscoveryModule, ModuleRef } from '@nestjs/core';
import {
  DynamicModule,
  Global,
  Inject,
  Module,
  OnApplicationShutdown,
  Provider,
  Type,
} from '@nestjs/common';
import {
  GrammyModuleAsyncOptions,
  GrammyModuleOptions,
  GrammyOptionsFactory,
} from './interfaces';
import { GRAMMY_BOT_NAME, GRAMMY_MODULE_OPTIONS } from './grammy.constants';
import { ListenersExplorerService, MetadataAccessorService } from './services';
import { createBotFactory, getBotToken } from './utils';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [ListenersExplorerService, MetadataAccessorService],
})
export class GrammyCoreModule implements OnApplicationShutdown {
  constructor(
    @Inject(GRAMMY_BOT_NAME)
    private readonly botName: string,
    private readonly moduleRef: ModuleRef,
  ) {}

  public static forRoot(options: GrammyModuleOptions): DynamicModule {
    const grammyBotName = getBotToken(options.botName);

    const grammyBotNameProvider = {
      provide: GRAMMY_BOT_NAME,
      useValue: grammyBotName,
    };

    const grammyBotProvider: Provider = {
      provide: grammyBotName,
      useFactory: async () => await createBotFactory(options),
    };

    return {
      module: GrammyCoreModule,
      providers: [
        {
          provide: GRAMMY_MODULE_OPTIONS,
          useValue: options,
        },
        grammyBotNameProvider,
        grammyBotProvider,
      ],
      exports: [grammyBotNameProvider, grammyBotProvider],
    };
  }

  public static forRootAsync(options: GrammyModuleAsyncOptions): DynamicModule {
    const grammyBotName = getBotToken(options.botName);

    const grammyBotNameProvider = {
      provide: GRAMMY_BOT_NAME,
      useValue: grammyBotName,
    };

    const grammyBotProvider: Provider = {
      provide: grammyBotName,
      useFactory: async (options: GrammyModuleOptions) =>
        await createBotFactory(options),
      inject: [GRAMMY_MODULE_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: GrammyCoreModule,
      imports: options.imports,
      providers: [
        ...asyncProviders,
        grammyBotNameProvider,
        grammyBotProvider,
      ],
      exports: [grammyBotNameProvider, grammyBotProvider],
    };
  }

  async onApplicationShutdown(): Promise<void> {
    const bot = this.moduleRef.get<any>(this.botName);
    bot && (await bot.stop());
  }

  private static createAsyncProviders(
    options: GrammyModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<GrammyOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: GrammyModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: GRAMMY_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    // `as Type<GrammyOptionsFactory>` is a workaround for microsoft/TypeScript#31603
    const inject = [
      (options.useClass || options.useExisting) as Type<GrammyOptionsFactory>,
    ];
    return {
      provide: GRAMMY_MODULE_OPTIONS,
      useFactory: async (optionsFactory: GrammyOptionsFactory) =>
        await optionsFactory.createGrammyOptions(),
      inject,
    };
  }
}
