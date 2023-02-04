import * as Collections from '../../common/constants/collections';
import FileSchema from '../schemas/fileSchema';

export default function (connection) {
  return connection.model(Collections.File, FileSchema, Collections.File);
}