import { decideIntakeV1 } from "../packages/domain/src/decision";
import { canonicalScenario } from "../tests/decision.snapshot.spec";

const result = decideIntakeV1(canonicalScenario);

console.log(JSON.stringify(result, null, 2));
