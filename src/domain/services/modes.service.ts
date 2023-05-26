import { Modes, type IModesService } from '~/domain/models'

class ModesService implements IModesService {
	setAnnotation = () => Modes.Annotation
	setCommand = () => Modes.Command
	setInsert = () => Modes.Insert
	setNormal = () => Modes.Normal
}

export const modesService = new ModesService()
