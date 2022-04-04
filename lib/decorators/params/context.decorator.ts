import { createGrammyParamDecorator } from '../../utils/param-decorator.util';
import { GrammyParamtype } from '../../enums/grammy-paramtype.enum';

export const Context: () => ParameterDecorator = createGrammyParamDecorator(
  GrammyParamtype.CONTEXT,
);

export const Ctx = Context;
