export default function autoNumberedSections(depth, structure) {
  let index1 = 1
  structure.forEach((node) => {
    if (node.level === 1) {
      let index2 = 1
      node.depth = `${index1}.`
      node.children && node.children.forEach((node2) => {
        if (node2.level === 2) {
          let index3 = 1
          node2.depth = `${index1}.${index2}.`
          node2.children && node2.children.forEach((node3) => {
            if (node3.level === 3) {
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
