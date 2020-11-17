import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommandType, Command, DoThis } from './union-arg-problem';

@Resolver(() => 'Query')
export class RootResolver {
  @Query(() => Date)
  now() {
    return new Date();
  }

  @Query(() => Command)
  commandReturnWorking() {
    const cmd: DoThis = {
      type: CommandType.DoThis,
      payload: {
        when: new Date(),
        what: 'do it',
        forThis: 'exactly this',
      },
    };
    return cmd;
  }

  @Mutation(() => Int)
  commandArgNotWorking(
    @Args('command', { type: () => Command }) command: Command,
  ) {
    console.log('command', command);
    return 0;
  }
}
