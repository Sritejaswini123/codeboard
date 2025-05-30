function validationErrors(issues: any[] = []) {
    return issues.reduce((acc, issue) => {
      if (issue.path?.[0]?.key) {
        acc[issue.path[0].key] = issue.message;
      }
      return acc;
    }, {} as Record<string, string>);
      
  }