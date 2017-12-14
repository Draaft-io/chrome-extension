import { intersection, filter, compose, uniq, flatten, unnest, reduce, map, defaultTo, pluck, append } from "ramda"

// Looks up all document sections which contain the selected elements
export const filterComponentSection = elementIds => sec => intersection(elementIds, sec.components).length === elementIds.length

// Retrieves all sections of a document whose components contain the element
export const getSectionArray = selectedElementIds => doc => filter(filterComponentSection(selectedElementIds))(doc.data.sections)

export const getDocumentArray = selectedElementIds => selectedDocuments => compose(uniq, flatten, unnest, reduce(append, []), map((doc) => {
  const array = []
  // Check if the section sits in the components field
  const onlyDoc = defaultTo([], intersection(selectedElementIds, pluck("_id", doc.components))).length > 0

  // When the document components field contains the selected elements, then don't add sections
  if (onlyDoc) {
    array.push([{ documentId: doc._id, documentTitle: doc.title, sectionId: null, sectionTitle: null }])
  }
  // When the component sits inside a document section, we map the sections
  const sections = getSectionArray(selectedElementIds)(doc)

  // if (sections.length === 0 && contains("importElementId", selectedElementIds)) {
  //   array.push([{ documentId: doc._id, documentTitle: doc.title, sectionId: null, sectionTitle: null }])
  // }

  if (sections.length > 0) {
    array.push(map(section => ({
      documentId: doc._id,
      documentTitle: doc.title,
      sectionId: section._id,
      sectionTitle: section.title,
    }))(sections))
  }
  return array
}))(selectedDocuments)
