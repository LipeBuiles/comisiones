const jerarquiaData = [
    {
        id: "region1",
        codigo: "R001",
        nombre: "Región Norte",
        tipo: "region",
        children: [
            {
                id: "ruta1",
                codigo: "RU101",
                nombre: "Ruta Principal Norte",
                tipo: "ruta",
                children: [
                    {
                        id: "circuito1",
                        codigo: "C1001",
                        nombre: "Circuito Urbano Norte",
                        tipo: "circuito",
                        children: [
                            {
                                id: "pdv1",
                                codigo: "PDV1001",
                                nombre: "Tienda Central Norte",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv2",
                                codigo: "PDV1002",
                                nombre: "Supermercado Norte",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv3",
                                codigo: "PDV1003",
                                nombre: "Centro Comercial Norte",
                                tipo: "pdv",
                                children: []
                            }
                        ]
                    },
                    {
                        id: "circuito2",
                        codigo: "C1002",
                        nombre: "Circuito Rural Norte",
                        tipo: "circuito",
                        children: [
                            {
                                id: "pdv4",
                                codigo: "PDV1004",
                                nombre: "Tienda Rural 1",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv5",
                                codigo: "PDV1005",
                                nombre: "Tienda Rural 2",
                                tipo: "pdv",
                                children: []
                            }
                        ]
                    },
                    {
                        id: "circuito3",
                        codigo: "C1003",
                        nombre: "Circuito Industrial Norte",
                        tipo: "circuito",
                        children: [
                            {
                                id: "pdv6",
                                codigo: "PDV1006",
                                nombre: "Tienda Industrial 1",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv7",
                                codigo: "PDV1007",
                                nombre: "Tienda Industrial 2",
                                tipo: "pdv",
                                children: []
                            }
                        ]
                    }
                ]
            },
            {
                id: "ruta2",
                codigo: "RU102",
                nombre: "Ruta Secundaria Norte",
                tipo: "ruta",
                children: [
                    {
                        id: "circuito4",
                        codigo: "C1004",
                        nombre: "Circuito Montañoso Norte",
                        tipo: "circuito",
                        children: [
                            {
                                id: "pdv8",
                                codigo: "PDV1008",
                                nombre: "Tienda Montañosa 1",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv9",
                                codigo: "PDV1009",
                                nombre: "Tienda Montañosa 2",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv10",
                                codigo: "PDV1010",
                                nombre: "Centro Alpino Norte",
                                tipo: "pdv",
                                children: []
                            }
                        ]
                    },
                    {
                        id: "circuito5",
                        codigo: "C1005",
                        nombre: "Circuito Comercial Norte",
                        tipo: "circuito",
                        children: [
                            {
                                id: "pdv11",
                                codigo: "PDV1011",
                                nombre: "Centro Comercial Norte Plaza",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv12",
                                codigo: "PDV1012",
                                nombre: "Tienda Departamental Norte",
                                tipo: "pdv",
                                children: []
                            }
                        ]
                    }
                ]
            },
            {
                id: "ruta3",
                codigo: "RU103",
                nombre: "Ruta Periférica Norte",
                tipo: "ruta",
                children: [
                    {
                        id: "circuito6",
                        codigo: "C1006",
                        nombre: "Circuito Exterior Norte",
                        tipo: "circuito",
                        children: [
                            {
                                id: "pdv13",
                                codigo: "PDV1013",
                                nombre: "Tienda Periférica Norte",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv14",
                                codigo: "PDV1014",
                                nombre: "Estación de Servicio Norte",
                                tipo: "pdv",
                                children: []
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "region2",
        codigo: "R002",
        nombre: "Región Sur",
        tipo: "region",
        children: [
            {
                id: "ruta4",
                codigo: "RU201",
                nombre: "Ruta Principal Sur",
                tipo: "ruta",
                children: [
                    {
                        id: "circuito7",
                        codigo: "C2001",
                        nombre: "Circuito Urbano Sur",
                        tipo: "circuito",
                        children: [
                            {
                                id: "pdv15",
                                codigo: "PDV2001",
                                nombre: "Tienda Central Sur",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv16",
                                codigo: "PDV2002",
                                nombre: "Supermercado Sur",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv17",
                                codigo: "PDV2003",
                                nombre: "Centro Comercial Sur",
                                tipo: "pdv",
                                children: []
                            }
                        ]
                    },
                    {
                        id: "circuito8",
                        codigo: "C2002",
                        nombre: "Circuito Costero Sur",
                        tipo: "circuito",
                        children: [
                            {
                                id: "pdv18",
                                codigo: "PDV2004",
                                nombre: "Tienda Playa Sur",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv19",
                                codigo: "PDV2005",
                                nombre: "Resort Costero Sur",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv20",
                                codigo: "PDV2006",
                                nombre: "Marina Sur",
                                tipo: "pdv",
                                children: []
                            }
                        ]
                    },
                    {
                        id: "circuito9",
                        codigo: "C2003",
                        nombre: "Circuito Turístico Sur",
                        tipo: "circuito",
                        children: [
                            {
                                id: "pdv21",
                                codigo: "PDV2007",
                                nombre: "Hotel Turístico Sur",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv22",
                                codigo: "PDV2008",
                                nombre: "Tienda Souvenirs Sur",
                                tipo: "pdv",
                                children: []
                            }
                        ]
                    }
                ]
            },
            {
                id: "ruta5",
                codigo: "RU202",
                nombre: "Ruta Secundaria Sur",
                tipo: "ruta",
                children: [
                    {
                        id: "circuito10",
                        codigo: "C2004",
                        nombre: "Circuito Portuario Sur",
                        tipo: "circuito",
                        children: [
                            {
                                id: "pdv23",
                                codigo: "PDV2009",
                                nombre: "Terminal Portuario Sur",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv24",
                                codigo: "PDV2010",
                                nombre: "Almacén Puerto Sur",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv25",
                                codigo: "PDV2011",
                                nombre: "Oficina Aduanas Sur",
                                tipo: "pdv",
                                children: []
                            }
                        ]
                    },
                    {
                        id: "circuito11",
                        codigo: "C2005",
                        nombre: "Circuito Rural Sur",
                        tipo: "circuito",
                        children: [
                            {
                                id: "pdv26",
                                codigo: "PDV2012",
                                nombre: "Tienda Rural Sur 1",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv27",
                                codigo: "PDV2013",
                                nombre: "Tienda Rural Sur 2",
                                tipo: "pdv",
                                children: []
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "region3",
        codigo: "R003",
        nombre: "Región Este",
        tipo: "region",
        children: [
            {
                id: "ruta6",
                codigo: "RU301",
                nombre: "Ruta Principal Este",
                tipo: "ruta",
                children: [
                    {
                        id: "circuito12",
                        codigo: "C3001",
                        nombre: "Circuito Central Este",
                        tipo: "circuito",
                        children: [
                            {
                                id: "pdv28",
                                codigo: "PDV3001",
                                nombre: "Tienda Central Este",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv29",
                                codigo: "PDV3002",
                                nombre: "Plaza Central Este",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv30",
                                codigo: "PDV3003",
                                nombre: "Oficina Principal Este",
                                tipo: "pdv",
                                children: []
                            }
                        ]
                    },
                    {
                        id: "circuito13",
                        codigo: "C3002",
                        nombre: "Circuito Universitario Este",
                        tipo: "circuito",
                        children: [
                            {
                                id: "pdv31",
                                codigo: "PDV3004",
                                nombre: "Cafetería Universidad Este",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv32",
                                codigo: "PDV3005",
                                nombre: "Librería Universitaria Este",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv33",
                                codigo: "PDV3006",
                                nombre: "Centro Estudiantil Este",
                                tipo: "pdv",
                                children: []
                            }
                        ]
                    }
                ]
            },
            {
                id: "ruta7",
                codigo: "RU302",
                nombre: "Ruta Periférica Este",
                tipo: "ruta",
                children: [
                    {
                        id: "circuito14",
                        codigo: "C3003",
                        nombre: "Circuito Industrial Este",
                        tipo: "circuito",
                        children: [
                            {
                                id: "pdv34",
                                codigo: "PDV3007",
                                nombre: "Planta Industrial Este 1",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv35",
                                codigo: "PDV3008",
                                nombre: "Planta Industrial Este 2",
                                tipo: "pdv",
                                children: []
                            }
                        ]
                    },
                    {
                        id: "circuito15",
                        codigo: "C3004",
                        nombre: "Circuito Montañoso Este",
                        tipo: "circuito",
                        children: [
                            {
                                id: "pdv36",
                                codigo: "PDV3009",
                                nombre: "Refugio Montaña Este",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv37",
                                codigo: "PDV3010",
                                nombre: "Tienda Alpina Este",
                                tipo: "pdv",
                                children: []
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "region4",
        codigo: "R004",
        nombre: "Región Oeste",
        tipo: "region",
        children: [
            {
                id: "ruta8",
                codigo: "RU401",
                nombre: "Ruta Principal Oeste",
                tipo: "ruta",
                children: [
                    {
                        id: "circuito16",
                        codigo: "C4001",
                        nombre: "Circuito Urbano Oeste",
                        tipo: "circuito",
                        children: [
                            {
                                id: "pdv38",
                                codigo: "PDV4001",
                                nombre: "Tienda Central Oeste",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv39",
                                codigo: "PDV4002",
                                nombre: "Centro Comercial Oeste",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv40",
                                codigo: "PDV4003",
                                nombre: "Supermercado Oeste",
                                tipo: "pdv",
                                children: []
                            }
                        ]
                    },
                    {
                        id: "circuito17",
                        codigo: "C4002",
                        nombre: "Circuito Comercial Oeste",
                        tipo: "circuito",
                        children: [
                            {
                                id: "pdv41",
                                codigo: "PDV4004",
                                nombre: "Plaza Comercial Oeste",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv42",
                                codigo: "PDV4005",
                                nombre: "Tienda Departamental Oeste",
                                tipo: "pdv",
                                children: []
                            }
                        ]
                    }
                ]
            },
            {
                id: "ruta9",
                codigo: "RU402",
                nombre: "Ruta Costera Oeste",
                tipo: "ruta",
                children: [
                    {
                        id: "circuito18",
                        codigo: "C4003",
                        nombre: "Circuito Turístico Oeste",
                        tipo: "circuito",
                        children: []
                    },
                    {
                        id: "circuito19",
                        codigo: "C4004",
                        nombre: "Circuito Portuario Oeste",
                        tipo: "circuito",
                        children: []
                    },
                    {
                        id: "circuito20",
                        codigo: "C4005",
                        nombre: "Circuito Rural Oeste",
                        tipo: "circuito",
                        children: []
                    }
                ]
            }
        ]
    },
    {
        id: "region5",
        codigo: "R005",
        nombre: "Región Central",
        tipo: "region",
        children: [
            {
                id: "ruta10",
                codigo: "RU501",
                nombre: "Ruta Metropolitana Central",
                tipo: "ruta",
                children: [
                    {
                        id: "circuito21",
                        codigo: "C5001",
                        nombre: "Circuito Financiero Central",
                        tipo: "circuito",
                        children: [
                            {
                                id: "pdv8",
                                codigo: "PDV5001",
                                nombre: "Centro Financiero Principal",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv9",
                                codigo: "PDV5002",
                                nombre: "Sucursal Bancaria Central",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv10",
                                codigo: "PDV5003",
                                nombre: "Tienda Premium Central",
                                tipo: "pdv",
                                children: []
                            }
                        ]
                    },
                    {
                        id: "circuito22",
                        codigo: "C5002",
                        nombre: "Circuito Gubernamental",
                        tipo: "circuito",
                        children: [
                            {
                                id: "pdv11",
                                codigo: "PDV5004",
                                nombre: "Oficina Gubernamental 1",
                                tipo: "pdv",
                                children: []
                            },
                            {
                                id: "pdv12",
                                codigo: "PDV5005",
                                nombre: "Oficina Gubernamental 2",
                                tipo: "pdv",
                                children: []
                            }
                        ]
                    },
                    {
                        id: "circuito23",
                        codigo: "C5003",
                        nombre: "Circuito Cultural",
                        tipo: "circuito",
                        children: []
                    }
                ]
            },
            {
                id: "ruta11",
                codigo: "RU502",
                nombre: "Ruta Periférica Central",
                tipo: "ruta",
                children: [
                    {
                        id: "circuito24",
                        codigo: "C5004",
                        nombre: "Circuito Comercial Central",
                        tipo: "circuito",
                        children: []
                    },
                    {
                        id: "circuito25",
                        codigo: "C5005",
                        nombre: "Circuito Residencial Central",
                        tipo: "circuito",
                        children: []
                    }
                ]
            },
            {
                id: "ruta12",
                codigo: "RU503",
                nombre: "Ruta Histórica Central",
                tipo: "ruta",
                children: [
                    {
                        id: "circuito26",
                        codigo: "C5006",
                        nombre: "Circuito Turístico Central",
                        tipo: "circuito",
                        children: []
                    },
                    {
                        id: "circuito27",
                        codigo: "C5007",
                        nombre: "Circuito de Museos",
                        tipo: "circuito",
                        children: []
                    },
                    {
                        id: "circuito28",
                        codigo: "C5008",
                        nombre: "Circuito Gastronómico Central",
                        tipo: "circuito",
                        children: []
                    }
                ]
            }
        ]
    }
];
