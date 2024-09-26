export type Zkonnect = {
  address: "D57msu1skRML54zj1pfZ2fzewCx9UPveeT29hys94jrk";
  metadata: {
    name: "zkonnect";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "closeAccount";
      discriminator: [125, 255, 149, 14, 110, 34, 72, 24];
      accounts: [
        {
          name: "account";
          writable: true;
        },
        {
          name: "receiver";
          writable: true;
        },
      ];
      args: [];
    },
    {
      name: "createEvent";
      discriminator: [49, 219, 29, 203, 22, 98, 100, 87];
      accounts: [
        {
          name: "creator";
          writable: true;
          signer: true;
        },
        {
          name: "mint";
        },
        {
          name: "merkleTree";
          writable: true;
        },
        {
          name: "collectionNft";
          writable: true;
        },
        {
          name: "event";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [122, 107, 111, 110, 110, 101, 99, 116];
              },
              {
                kind: "account";
                path: "creator";
              },
              {
                kind: "arg";
                path: "eventName";
              },
            ];
          };
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "tokenProgram";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "eventName";
          type: "string";
        },
        {
          name: "creatorName";
          type: "string";
        },
        {
          name: "creatorDomain";
          type: "string";
        },
        {
          name: "eventDescription";
          type: "string";
        },
        {
          name: "banner";
          type: "string";
        },
        {
          name: "dateTime";
          type: "u64";
        },
        {
          name: "location";
          type: "string";
        },
        {
          name: "nfturi";
          type: "string";
        },
        {
          name: "ticketPrice";
          type: "u64";
        },
        {
          name: "totalTickets";
          type: "u8";
        },
        {
          name: "paySol";
          type: "u8";
        },
      ];
    },
    {
      name: "payForTicket";
      discriminator: [53, 4, 206, 92, 229, 69, 100, 83];
      accounts: [
        {
          name: "from";
          writable: true;
          signer: true;
        },
        {
          name: "to";
          writable: true;
        },
        {
          name: "mint";
          relations: ["event"];
        },
        {
          name: "fromAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "from";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169,
                ];
              },
              {
                kind: "account";
                path: "mint";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "toAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "to";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169,
                ];
              },
              {
                kind: "account";
                path: "mint";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "event";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [122, 107, 111, 110, 110, 101, 99, 116];
              },
              {
                kind: "account";
                path: "to";
              },
              {
                kind: "account";
                path: "event.event_name";
                account: "event";
              },
            ];
          };
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "tokenProgram";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [];
    },
    {
      name: "paySolForTicket";
      discriminator: [19, 209, 155, 74, 199, 137, 84, 149];
      accounts: [
        {
          name: "from";
          writable: true;
          signer: true;
        },
        {
          name: "to";
          writable: true;
        },
        {
          name: "event";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [122, 107, 111, 110, 110, 101, 99, 116];
              },
              {
                kind: "account";
                path: "to";
              },
              {
                kind: "account";
                path: "event.event_name";
                account: "event";
              },
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [];
    },
  ];
  accounts: [
    {
      name: "event";
      discriminator: [125, 192, 125, 158, 9, 115, 152, 233];
    },
  ];
  errors: [
    {
      code: 6000;
      name: "paySolNotEnabled";
      msg: "Pay Sol not enabled";
    },
    {
      code: 6001;
      name: "ticketSoldOut";
      msg: "Ticket sold out";
    },
    {
      code: 6002;
      name: "payOnlySol";
      msg: "Only SOL is accepted";
    },
  ];
  types: [
    {
      name: "event";
      type: {
        kind: "struct";
        fields: [
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "creator";
            type: "pubkey";
          },
          {
            name: "mint";
            type: "pubkey";
          },
          {
            name: "merkleTree";
            type: "pubkey";
          },
          {
            name: "collectionNft";
            type: "pubkey";
          },
          {
            name: "creatorName";
            type: "string";
          },
          {
            name: "creatorDomain";
            type: "string";
          },
          {
            name: "eventName";
            type: "string";
          },
          {
            name: "eventDescription";
            type: "string";
          },
          {
            name: "banner";
            type: "string";
          },
          {
            name: "dateTime";
            type: "u64";
          },
          {
            name: "location";
            type: "string";
          },
          {
            name: "nfturi";
            type: "string";
          },
          {
            name: "ticketPrice";
            type: "u64";
          },
          {
            name: "ticketsSold";
            type: "u8";
          },
          {
            name: "totalTickets";
            type: "u8";
          },
          {
            name: "paySol";
            type: "u8";
          },
        ];
      };
    },
  ];
};
