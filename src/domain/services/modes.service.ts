import { Modes, type IModesService } from '~/domain/models'

export class ModesService implements IModesService {
	setAnnotation = () => Modes.Annotation
	setCommand = () => Modes.Command
	setInsert = () => Modes.Insert
	setNormal = () => Modes.Normal
}
