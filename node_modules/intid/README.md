# intid

Generate Numeric Id based on Nano Seconds

FEATURE:

Allows Prefix, Suffix and Affix Strings

Allows Limiting of Integer Length Starting At The End To Be Always Unique

eg:

intid();

intid('prefix', 'PFX', '-');

intid('suffix', 'SFX', '-');

intid('affix', 'AFX', '-');

intid('prefix', 'PFX', '-', 10);

intid(10);

output:

269905728536421

PFX-269905728536421

269905728536421-SFX

AFX-269905728536421-AFX

PFX-5728536421

5728536421
