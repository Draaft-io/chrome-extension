export default function autoNumberedSections(depth, structure) {
  let index1 = 1
  structure.forEach((node) => {
    // We need to check for levels, otherwise we also number other text lines
    if (node.level) {
      let index2 = 1
      node.depth = `${index1}.`
      node.children && node.children.forEach((node2) => {
        if (node2.level) {
          let index3 = 1
          node2.depth = `${index1}.${index2}.`
          node2.children && node2.children.forEach((node3) => {
            if (node3.level) {
              node3.depth = `${index1}.${index2}.${index3}.`
              index3++
            }
          })
          index2++
        }
      })
    }
    index1++
    return node
  })
  return structure
}
