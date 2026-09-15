import { BadRequestException, type PipeTransform } from '@nestjs/common';
import type { output, ZodType } from 'zod';

/**
 * Validates and parses an incoming payload against a Zod schema, applying its
 * defaults and transforms. On failure it throws a 400 with a flat list of
 * field errors. Construct per-route: `@Body(new ZodValidationPipe(createFooSchema))`.
 *
 * The generic is parameterized on the schema type `S` (not its output `T`) so
 * TypeScript binds it directly instead of structurally unifying `ZodType<T>`
 * against deep schemas — which otherwise triggers TS2589 on `.partial()`/transforms.
 */
export class ZodValidationPipe<S extends ZodType>
  implements PipeTransform<unknown, output<S>>
{
  constructor(private readonly schema: S) {}

  transform(value: unknown): output<S> {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    return result.data;
  }
}
