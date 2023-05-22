import { Modes, type ModesModel } from '~/domain/models'

class ModesService implements ModesModel {
	setAnnotation = () => Modes.Annotation
	setCommand = () => Modes.Command
	setInsert = () => Modes.Insert
	setNormal = () => Modes.Normal
}

export const modesService = new ModesService()
