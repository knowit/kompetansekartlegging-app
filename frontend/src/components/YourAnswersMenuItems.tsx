const getYourAnswersMenuItems = (categories: any, alerts: any) =>
  categories.map((cat: string) => {
    return {
      key: cat,
      text: cat,
      alert: alerts?.categoryMap.get(cat),
    }
  })

export default getYourAnswersMenuItems
