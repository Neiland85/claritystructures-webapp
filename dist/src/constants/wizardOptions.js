"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urgencyLevels = exports.clientProfiles = void 0;
exports.clientProfiles = [
    {
        value: 'private_individual',
        label: 'Particular afectado directamente',
        description: 'Soy la persona perjudicada'
    },
    {
        value: 'family_inheritance_conflict',
        label: 'Conflicto familiar / herencia',
        description: 'Disputas entre familiares, posible ocultación o borrado de pruebas'
    },
    {
        value: 'legal_professional',
        label: 'Abogado / despacho legal',
        description: 'Actúo en representación de un cliente'
    },
    {
        value: 'court_related',
        label: 'Procedimiento judicial en curso',
        description: 'Juzgado, fiscalía o medidas ya iniciadas'
    },
    {
        value: 'other',
        label: 'Otro contexto'
    }
];
exports.urgencyLevels = [
    {
        value: 'informational',
        label: 'Consulta informativa / preventiva'
    },
    {
        value: 'time_sensitive',
        label: 'Riesgo de pérdida de pruebas o datos'
    },
    {
        value: 'legal_risk',
        label: 'Riesgo legal inmediato'
    },
    {
        value: 'critical',
        label: 'Situación crítica (impacto legal o emocional grave)'
    }
];
