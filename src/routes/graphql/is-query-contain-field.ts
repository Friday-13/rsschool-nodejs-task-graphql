import { GraphQLResolveInfo, Kind } from 'graphql';

const isQueryContainField = (info: GraphQLResolveInfo, fieldName: string) => {
  const selections = info.fieldNodes[0].selectionSet?.selections;
  return selections?.some((selection) => {
    if (selection.kind === Kind.FIELD) {
      return selection.name.value === fieldName;
    }
    return false;
  });
};

export { isQueryContainField as default };
