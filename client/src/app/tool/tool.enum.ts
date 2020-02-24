export enum Tool {
   // implicit zero
   // “if (tool)” == “if (tool !== Tool._None)”
   // “if (tool > Tool._None && tool < Tool._Len)”
   // “for (let tool = Tool._None + 1; tool < Tool._Len; tool++)”
   // “for (let tool = Tool._Len; --tool; )”
   // downsize is loosing first case in array
  _None,
  Aerosol,
  Applicator,
  Brush,
  Ellipse,
  Eraser,
  Line,
  Pencil,
  Pipette,
  Polygon,
  Rectangle,
  Selection,
  _Len,
}
