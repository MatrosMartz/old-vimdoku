import { Modes, type ModesServiceSchema } from '~/domain/models'

class ModesService implements ModesServiceSchema {
	setAnnotation = () => Modes.Annotation
	setCommand = () => Modes.Command
	setInsert = () => Modes.Insert
	setNormal = () => Modes.Normal
}

export const modesService = new ModesService()
