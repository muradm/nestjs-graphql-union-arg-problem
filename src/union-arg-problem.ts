import {
  createUnionType,
  Field,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

export enum CommandType {
  DoThis = 'DoThis',
  DoThat = 'DoThat',
}

registerEnumType(CommandType, { name: 'CommandType' });

@ObjectType({ isAbstract: true })
class BaseCommandPayload {
  @Field()
  what!: string;

  @Field()
  when!: Date;
}

@ObjectType()
class DoThisPayload extends BaseCommandPayload {
  @Field()
  forThis!: string;
}

@ObjectType()
class DoThatPayload extends BaseCommandPayload {
  @Field()
  forThat!: string;
}

@ObjectType({ isAbstract: true })
class BaseCommand<T extends keyof typeof CommandType> {
  @Field(() => CommandType)
  type!: T;
}

@ObjectType()
export class DoThis extends BaseCommand<CommandType.DoThis> {
  @Field(() => DoThisPayload)
  payload!: DoThisPayload;
}

@ObjectType()
export class DoThat extends BaseCommand<CommandType.DoThat> {
  @Field(() => DoThatPayload)
  payload!: DoThatPayload;
}

export const Command = createUnionType({
  name: 'Command',
  types: () => [DoThis, DoThat],
  resolveType: (command: BaseCommand<CommandType>) => {
    switch (command.type) {
      case CommandType.DoThis:
        return DoThis;
      case CommandType.DoThat:
        return DoThat;
    }
  },
});
export type Command = typeof Command;
