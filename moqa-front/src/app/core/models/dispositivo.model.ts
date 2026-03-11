export interface Dispositivo {
    id?: number;
    zona: string;
    latitude: number;
    longitude: number;
    bairro?: string;
    referencia?: string;
    localizadorGoogle?: string;
    logs?: LogEvento[];
  }
  
  export interface LogEvento {
    id?: number;
    data?: string;
    local: string;
    descricao: string;
    observacoes?: string;
  }