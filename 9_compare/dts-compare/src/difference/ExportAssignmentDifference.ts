import Difference from "./Difference";

export default class ExportAssignmentDifference implements Difference {
	private exportAssignmentExpected: string;
	private exportAssignmentActual: string;

	static CODE = "export-assignment-is-different";

	code = ExportAssignmentDifference.CODE;

	constructor(exportAssignmentExpected: string, exportAssignmentActual: string) {
		this.exportAssignmentExpected = exportAssignmentExpected;
		this.exportAssignmentActual = exportAssignmentActual;
	}
}