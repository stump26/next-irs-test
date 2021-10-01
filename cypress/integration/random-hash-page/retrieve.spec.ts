/// <reference types="cypress" />
import createHash from 'hash-generator'

describe('random page retrieve',()=>{
  const RETRIEVE_COUNT = 100
  
  for(let i=0;i<RETRIEVE_COUNT;i++){
    const hash = createHash(15)
    it(`visit ${hash}`,()=>{
      cy.visit(`/posts/${hash}`)
      cy.get('#__next > div > p').contains(hash)
      cy.get('#__next > div > img')
    })
  }
})